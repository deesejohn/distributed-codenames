// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v4.22.0
// source: games.proto

package protos

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// GamesServiceClient is the client API for GamesService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type GamesServiceClient interface {
	CreateGame(ctx context.Context, in *CreateGameRequest, opts ...grpc.CallOption) (*CreateGameResponse, error)
	GetGame(ctx context.Context, in *GetGameRequest, opts ...grpc.CallOption) (*GetGameResponse, error)
	Guess(ctx context.Context, in *GuessRequest, opts ...grpc.CallOption) (*GuessResponse, error)
	Hint(ctx context.Context, in *HintRequest, opts ...grpc.CallOption) (*HintResponse, error)
	PlayAgain(ctx context.Context, in *PlayAgainRequest, opts ...grpc.CallOption) (*PlayAgainResponse, error)
	SkipTurn(ctx context.Context, in *SkipTurnRequest, opts ...grpc.CallOption) (*SkipTurnResponse, error)
}

type gamesServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewGamesServiceClient(cc grpc.ClientConnInterface) GamesServiceClient {
	return &gamesServiceClient{cc}
}

func (c *gamesServiceClient) CreateGame(ctx context.Context, in *CreateGameRequest, opts ...grpc.CallOption) (*CreateGameResponse, error) {
	out := new(CreateGameResponse)
	err := c.cc.Invoke(ctx, "/distributed_codenames.GamesService/CreateGame", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *gamesServiceClient) GetGame(ctx context.Context, in *GetGameRequest, opts ...grpc.CallOption) (*GetGameResponse, error) {
	out := new(GetGameResponse)
	err := c.cc.Invoke(ctx, "/distributed_codenames.GamesService/GetGame", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *gamesServiceClient) Guess(ctx context.Context, in *GuessRequest, opts ...grpc.CallOption) (*GuessResponse, error) {
	out := new(GuessResponse)
	err := c.cc.Invoke(ctx, "/distributed_codenames.GamesService/Guess", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *gamesServiceClient) Hint(ctx context.Context, in *HintRequest, opts ...grpc.CallOption) (*HintResponse, error) {
	out := new(HintResponse)
	err := c.cc.Invoke(ctx, "/distributed_codenames.GamesService/Hint", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *gamesServiceClient) PlayAgain(ctx context.Context, in *PlayAgainRequest, opts ...grpc.CallOption) (*PlayAgainResponse, error) {
	out := new(PlayAgainResponse)
	err := c.cc.Invoke(ctx, "/distributed_codenames.GamesService/PlayAgain", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *gamesServiceClient) SkipTurn(ctx context.Context, in *SkipTurnRequest, opts ...grpc.CallOption) (*SkipTurnResponse, error) {
	out := new(SkipTurnResponse)
	err := c.cc.Invoke(ctx, "/distributed_codenames.GamesService/SkipTurn", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// GamesServiceServer is the server API for GamesService service.
// All implementations must embed UnimplementedGamesServiceServer
// for forward compatibility
type GamesServiceServer interface {
	CreateGame(context.Context, *CreateGameRequest) (*CreateGameResponse, error)
	GetGame(context.Context, *GetGameRequest) (*GetGameResponse, error)
	Guess(context.Context, *GuessRequest) (*GuessResponse, error)
	Hint(context.Context, *HintRequest) (*HintResponse, error)
	PlayAgain(context.Context, *PlayAgainRequest) (*PlayAgainResponse, error)
	SkipTurn(context.Context, *SkipTurnRequest) (*SkipTurnResponse, error)
	mustEmbedUnimplementedGamesServiceServer()
}

// UnimplementedGamesServiceServer must be embedded to have forward compatible implementations.
type UnimplementedGamesServiceServer struct {
}

func (UnimplementedGamesServiceServer) CreateGame(context.Context, *CreateGameRequest) (*CreateGameResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method CreateGame not implemented")
}
func (UnimplementedGamesServiceServer) GetGame(context.Context, *GetGameRequest) (*GetGameResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetGame not implemented")
}
func (UnimplementedGamesServiceServer) Guess(context.Context, *GuessRequest) (*GuessResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Guess not implemented")
}
func (UnimplementedGamesServiceServer) Hint(context.Context, *HintRequest) (*HintResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Hint not implemented")
}
func (UnimplementedGamesServiceServer) PlayAgain(context.Context, *PlayAgainRequest) (*PlayAgainResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method PlayAgain not implemented")
}
func (UnimplementedGamesServiceServer) SkipTurn(context.Context, *SkipTurnRequest) (*SkipTurnResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SkipTurn not implemented")
}
func (UnimplementedGamesServiceServer) mustEmbedUnimplementedGamesServiceServer() {}

// UnsafeGamesServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to GamesServiceServer will
// result in compilation errors.
type UnsafeGamesServiceServer interface {
	mustEmbedUnimplementedGamesServiceServer()
}

func RegisterGamesServiceServer(s grpc.ServiceRegistrar, srv GamesServiceServer) {
	s.RegisterService(&GamesService_ServiceDesc, srv)
}

func _GamesService_CreateGame_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CreateGameRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GamesServiceServer).CreateGame(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/distributed_codenames.GamesService/CreateGame",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GamesServiceServer).CreateGame(ctx, req.(*CreateGameRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _GamesService_GetGame_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetGameRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GamesServiceServer).GetGame(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/distributed_codenames.GamesService/GetGame",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GamesServiceServer).GetGame(ctx, req.(*GetGameRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _GamesService_Guess_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GuessRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GamesServiceServer).Guess(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/distributed_codenames.GamesService/Guess",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GamesServiceServer).Guess(ctx, req.(*GuessRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _GamesService_Hint_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(HintRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GamesServiceServer).Hint(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/distributed_codenames.GamesService/Hint",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GamesServiceServer).Hint(ctx, req.(*HintRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _GamesService_PlayAgain_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(PlayAgainRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GamesServiceServer).PlayAgain(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/distributed_codenames.GamesService/PlayAgain",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GamesServiceServer).PlayAgain(ctx, req.(*PlayAgainRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _GamesService_SkipTurn_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(SkipTurnRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(GamesServiceServer).SkipTurn(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/distributed_codenames.GamesService/SkipTurn",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(GamesServiceServer).SkipTurn(ctx, req.(*SkipTurnRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// GamesService_ServiceDesc is the grpc.ServiceDesc for GamesService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var GamesService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "distributed_codenames.GamesService",
	HandlerType: (*GamesServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "CreateGame",
			Handler:    _GamesService_CreateGame_Handler,
		},
		{
			MethodName: "GetGame",
			Handler:    _GamesService_GetGame_Handler,
		},
		{
			MethodName: "Guess",
			Handler:    _GamesService_Guess_Handler,
		},
		{
			MethodName: "Hint",
			Handler:    _GamesService_Hint_Handler,
		},
		{
			MethodName: "PlayAgain",
			Handler:    _GamesService_PlayAgain_Handler,
		},
		{
			MethodName: "SkipTurn",
			Handler:    _GamesService_SkipTurn_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "games.proto",
}
